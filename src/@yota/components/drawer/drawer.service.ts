import { Injectable } from '@angular/core';
import { YotaDrawerComponent } from '@yota/components/drawer/drawer.component';

@Injectable({providedIn: 'root'})
export class YotaDrawerService
{
    private _componentRegistry: Map<string, YotaDrawerComponent> = new Map<string, YotaDrawerComponent>();

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: YotaDrawerComponent): void
    {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void
    {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): YotaDrawerComponent | undefined
    {
        return this._componentRegistry.get(name);
    }
}
