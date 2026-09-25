import { Component } from '../base/Component';
import type { ICatalogView } from '../../types';

export class Catalog extends Component<ICatalogView> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }
}
