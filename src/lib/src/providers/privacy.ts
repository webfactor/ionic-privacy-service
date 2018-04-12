import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from 'ionic-angular';
import * as _ from 'lodash';
import moment from 'moment';

import { PrivacyModalPage } from '../pages/privacy-modal/privacy-modal';

/**
 * TODO:
 * --> Markdown
 */

@Injectable()
export class PrivacyService {
    private readonly storageKey: string = 'privacyConfirmedAt';
    private url: string = '';
    private document: { title: string; body: string; updatedAt: string } = null;

    constructor(
        private storage: Storage,
        private http: HttpClient,
        private modalCtrl: ModalController,
        private translate: TranslateService
    ) {}

    setUrl(url: string): void {
        this.url = url;
    }

    async checkForPrivacyUpdates(autoConfirm: boolean = true): Promise<any> {
        let lastConfirmation: moment.Moment = null;

        try {
            lastConfirmation = await this.getConfirmationDate();
        } catch (err) {
            lastConfirmation = null;
        } finally {
            this.document = await this.getContent();
            if (!lastConfirmation || moment(this.document.updatedAt).isAfter(lastConfirmation)) {
                if (autoConfirm) return this.presentConfirmationDialog();
                return Promise.resolve();
            }

            return Promise.reject(null);
        }
    }

    private getConfirmationDate(): Promise<moment.Moment> {
        return new Promise((resolve, reject) => {
            this.storage
                .get(this.storageKey)
                .then(date => {
                    date ? resolve(moment(date)) : reject();
                })
                .catch(err => {
                    reject();
                });
        });
    }

    private getContent(): Promise<{ title: string; body: string; updatedAt: string }> {
        let url = this.url,
            lang = this.translate.currentLang;

        if (lang) url += '?lang=' + lang;

        return this.http
            .get(url)
            .map((body: any) => {
                let doc = this.findPrivacyDocument(body.documents || body.data.documents);
                return doc || body;
            })
            .toPromise();
    }

    private findPrivacyDocument(
        documents: any[]
    ): { title: string; body: string; updatedAt: string } {
        return documents.find(doc => doc.type == 'privacy');
    }

    async presentConfirmationDialog(): Promise<any> {
        if (!this.document) this.document = await this.getContent();

        return new Promise((resolve, reject) => {
            let modal = this.modalCtrl.create(PrivacyModalPage, {
                document: this.document,
                enableBackdropDismiss: false
            });
            modal.present();
            modal.onDidDismiss((confirmed: boolean) => {
                if (confirmed) {
                    this.storage.set(this.storageKey, moment().toISOString());
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }
}
