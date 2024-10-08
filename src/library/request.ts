import { PlayerError } from './error';
import { IOnProgress } from './sound';

export interface IRequested {
    url: string;
    loadingProgress: number;
    onLoading?: IOnProgress;
}

export class PlayerRequest {

    // TODO: add possibility to abort http request

    public getArrayBuffer(requested: IRequested): Promise<ArrayBuffer> {

        return new Promise(function (resolve, reject) {

            const xhr = new XMLHttpRequest();

            // TODO: abort the request?
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort

            // thirs parameter is for "async", default true but who knows if prefer to explicitly set it just in case
            xhr.open('GET', requested.url, true);

            // set the expected response type from the server to arraybuffer
            xhr.responseType = 'arraybuffer';

            xhr.onload = function (): void {

                // gets called even on for example 404, so check the status
                if (xhr.status === 200) {

                    // successful request so now we can resolve the promise
                    resolve(xhr.response);

                } else {

                    // something went wrong so we reject with an error
                    reject(new PlayerError(xhr.statusText, xhr.status));

                }

            };

            xhr.onprogress = function (event): void {

                const percentage = 100 / (event.total / event.loaded);

                // update value on sound object
                requested.loadingProgress = percentage;

                if (requested.onLoading !== null) {
                    requested.onLoading(percentage, event.total, event.loaded);
                }

            };

            // also reject for any kind of network errors
            xhr.onerror = function (): void {

                reject(new PlayerError('xhr network error'));

            };

            // now make the request
            xhr.send();

        });

    }

}
