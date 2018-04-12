import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'privacy-modal-page',
    templateUrl: 'privacy-modal.html'
})
export class PrivacyModalPage {
    isConfirmed: boolean = false;
    document: { title: string; body: string; updatedAt: string } = null;

    constructor(private navParams: NavParams, private viewController: ViewController) {
        this.document = this.navParams.get('document');
    }

    onConfirm(): void {
        this.isConfirmed = true;
        this.viewController.dismiss(true);
    }

    ionViewCanLeave(): boolean {
        return this.isConfirmed;
    }
}
