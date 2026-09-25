import { Card } from './Card';
import type { TCardView } from '../../types';

export class CatalogCard extends Card<TCardView> {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        container.addEventListener('click', onClick);
    }
}
