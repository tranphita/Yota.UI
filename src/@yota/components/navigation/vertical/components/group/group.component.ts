import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { YotaNavigationService } from '@yota/components/navigation/navigation.service';
import { YotaNavigationItem } from '@yota/components/navigation/navigation.types';
import { YotaVerticalNavigationBasicItemComponent } from '@yota/components/navigation/vertical/components/basic/basic.component';
import { YotaVerticalNavigationCollapsableItemComponent } from '@yota/components/navigation/vertical/components/collapsable/collapsable.component';
import { YotaVerticalNavigationDividerItemComponent } from '@yota/components/navigation/vertical/components/divider/divider.component';
import { YotaVerticalNavigationSpacerItemComponent } from '@yota/components/navigation/vertical/components/spacer/spacer.component';
import { YotaVerticalNavigationComponent } from '@yota/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'yota-vertical-navigation-group-item',
    templateUrl    : './group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass, NgIf, MatIconModule, NgFor, YotaVerticalNavigationBasicItemComponent, YotaVerticalNavigationCollapsableItemComponent, YotaVerticalNavigationDividerItemComponent, forwardRef(() => YotaVerticalNavigationGroupItemComponent), YotaVerticalNavigationSpacerItemComponent],
})
export class YotaVerticalNavigationGroupItemComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() autoCollapse: boolean;
    @Input() item: YotaNavigationItem;
    @Input() name: string;

    private _yotaVerticalNavigationComponent: YotaVerticalNavigationComponent;
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
        this._yotaVerticalNavigationComponent = this._yotaNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._yotaVerticalNavigationComponent.onRefreshed.pipe(
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
