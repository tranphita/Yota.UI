import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { yotaAnimations } from '@yota/animations';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : yotaAnimations,
    standalone   : true,
    imports      : [RouterLink],
})
export class AuthConfirmationRequiredComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
