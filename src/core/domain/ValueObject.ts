/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable complexity */
import { shallowEqual } from 'shallow-equal-object';

interface IValueObjectProps {
    [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */

export abstract class ValueObject<T extends IValueObjectProps> {
    public readonly props: T;

    constructor(props: T) {
        this.props = Object.freeze(props);
    }

    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return shallowEqual(this.props, vo.props);
    }
}
