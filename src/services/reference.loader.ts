export interface RemoteReference {
    sourceId: string;
    url: string;
}

export class ReferenceLoader {

    async load(
        reference: RemoteReference
    ): Promise<unknown> {

        const response =
            await fetch(
                reference.url
            );

        if (!response.ok) {
            throw new Error(
                `Gagal mengambil reference ${reference.url}: ${response.status}`
            );
        }

        return response.json();
    }
}
