# Privacy Service

Checks for updated privacy contents and shows a privacy confirmation dialog. ✅  
The dialog can not be dismissed without confirmation.

The following translations are needed:
```json
{
    "privacy": {
        "updatedAt": "letztes Update",
        "accept": "Akzeptieren"
    }
}
```

## Methods:
```typescript
setUrl(url: string): void
```
Sets the url to the api. The privacy document should sit in _documents_ or _data.documents_ property of the response object. It should at least contain a _title_, _body_ and _updatedAt_ property.

```typescript
checkForPrivacyUpdates(autoConfirm: boolean = true): Promise<any> 
```
Checks for an updated privacy document since the last confirmation. 
* Resolves if an updated document is present.
* Rejects if there are no updates.
* When using the _ autoConfirm_ flag, the promise resolves on confirmation.

```typescript
presentConfirmationModal(): Promise<any>
```
Unconditionally presents the confirmation dialog, not taking the last confirmation date in concern.
Resolves on confirmation.

## Example
```typescript
export class AppComponent implements OnInit {
    constructor(private privacyService: PrivacyService) {}

    ngOnInit(): void {
        this.privacyService.setUrl('http://webfactormedia.de/api/v1/documents');
        this.privacyService.checkForPrivacyUpdates(true).then(
            () => {
                console.log('confirmed');
            },
            err => {
                console.log('no updates');
            }
        );
    }
}
```