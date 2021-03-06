/*
* Copyright 2018 herd-ui contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule, InjectionToken } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BASE_PATH, ApiModule, Configuration
} from '@herd/angular-client';
import { ConfigService } from 'app/core/services/config.service';
import { AppInitService, appInitFactory } from 'app/core/services/app-init.service';
import { CoreModule, WINDOW } from 'app/core/core.module';
import { RouteReuseStrategy, Router } from '@angular/router';
import { CustomRouteReuseStrategy } from 'app/core/services/custom-route-reuse-strategy.service';
import { CustomLocation } from 'app/core/services/custom-location.service';
import { Location } from '@angular/common';
import { HttpClientModule  } from '@angular/common/http';
import { HttpInterceptorModule } from 'ng-http-interceptor';

export function appApiConfigFactory(): Configuration {
  return new Configuration();
}

export function restBasePathFactory(appConfig: ConfigService, apiConfig: Configuration): string {
  if (appConfig.config.useBasicAuth && appConfig.config.basicAuthRestBaseUri) {
    apiConfig.withCredentials = true;
    return appConfig.config.basicAuthRestBaseUri;
  }

  apiConfig.withCredentials = true;
  return appConfig.config.restBaseUri;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpInterceptorModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    CoreModule.forRoot(),
    ApiModule.forRoot(appApiConfigFactory)
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [AppInitService],
      multi: true
    },
    {
      provide: Configuration,
      useFactory: appApiConfigFactory,
      multi: false
    },
    {
      provide: BASE_PATH,
      useFactory: restBasePathFactory,
      deps: [ConfigService, Configuration]
    },
    {
      provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy
    }, {
      provide: Location, useClass: CustomLocation
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
