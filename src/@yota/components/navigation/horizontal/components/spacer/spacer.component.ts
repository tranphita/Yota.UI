import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { YotaHorizontalNavigationComponent } from '@yota/components/navigation/horizontal/horizontal.component';
import { YotaNavigationService } from '@yota/components/navigation/navigation.service';
import { YotaNavigationItem } from '@yota/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'yota-horizontal-navigation-spacer-item',
    templateUrl    : './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass],
})
export class YotaHorizontalNavigationSpacerItemComponent implements OnInit, OnDestroy
{
    @Input() item: YotaNavigationItem;
    @Input() name: string;

    private _yotaHorizontalNavigationComponent: YotaHorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _yotaNavigationService: YotaNavigationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._yotaHorizontalNavigationComponent = this._yotaNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._yotaHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
