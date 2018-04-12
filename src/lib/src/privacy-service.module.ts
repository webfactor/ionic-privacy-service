import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';

import { PrivacyModalPage } from './pages/privacy-modal/privacy-modal';
import { PrivacyService } from './providers/privacy';

@NgModule({
    imports: [CommonModule, IonicModule, TranslateModule.forRoot(), IonicStorageModule.forRoot()],
    declarations: [PrivacyModalPage],
    entryComponents: [PrivacyModalPage],
    exports: [PrivacyModalPage]
})
export class PrivacyServiceModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PrivacyServiceModule,
            providers: [PrivacyService]
        };
    }
}
