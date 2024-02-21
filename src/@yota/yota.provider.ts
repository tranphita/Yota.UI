import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { YOTA_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from '@yota/lib/mock-api';
import { YotaConfig } from '@yota/services/config';
import { YOTA_CONFIG } from '@yota/services/config/config.constants';
import { YotaConfirmationService } from '@yota/services/confirmation';
import { yotaLoadingInterceptor, YotaLoadingService } from '@yota/services/loading';
import { YotaMediaWatcherService } from '@yota/services/media-watcher';
import { YotaPlatformService } from '@yota/services/platform';
import { YotaSplashScreenService } from '@yota/services/splash-screen';
import { YotaUtilsService } from '@yota/services/utils';

export type YotaProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    yota?: YotaConfig
}

/**
 * Yota provider
 */
export const provideYota = (config: YotaProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide : YOTA_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : YOTA_CONFIG,
            useValue: config?.yota ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(YotaConfirmationService),
            multi   : true,
        },

        provideHttpClient(withInterceptors([yotaLoadingInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(YotaLoadingService),
            multi   : true,
        },

        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(YotaMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(YotaPlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(YotaSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(YotaUtilsService),
            multi   : true,
        },
    ];

    // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
