import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { yotaAnimations } from '@yota/animations';
import { YotaNavigationService } from '@yota/components/navigation/navigation.service';
import { YotaNavigationItem } from '@yota/components/navigation/navigation.types';
import { YotaUtilsService } from '@yota/services/utils/utils.service';
import { ReplaySubject, Subject } from 'rxjs';
import { YotaHorizontalNavigationBasicItemComponent } from './components/basic/basic.component';
import { YotaHorizontalNavigationBranchItemComponent } from './components/branch/branch.component';
import { YotaHorizontalNavigationSpacerItemComponent } from './components/spacer/spacer.component';

@Component({
    selector       : 'yota-horizontal-navigation',
    templateUrl    : './horizontal.component.html',
    styleUrls      : ['./horizontal.component.scss'],
    animations     : yotaAnimations,
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'yotaHorizontalNavigation',
    standalone     : true,
    imports        : [NgFor, NgIf, YotaHorizontalNavigationBasicItemComponent, YotaHorizontalNavigationBranchItemComponent, YotaHorizontalNavigationSpacerItemComponent],
})
export class YotaHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = this._yotaUtilsService.randomId();
    @Input() navigation: YotaNavigationItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _yotaNavigationService: YotaNavigationService,
        private _yotaUtilsService: YotaUtilsService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Navigation
        if ( 'navigation' in changes )
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Make sure the name input is not an empty string
        if ( this.name === '' )
        {
            this.name = this._yotaUtilsService.randomId();
        }

        // Register the navigation component
        this._yotaNavigationService.registerComponent(this.name, this);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Deregister the navigation component from the registry
        this._yotaNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void
    {
        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

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
