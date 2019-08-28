import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PostsComponent } from './posts/posts.component';
import { PostService } from './services/post.service';
import { EditpostComponent } from './editpost/editpost.component';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { HeaderComponent } from './core/header/header.component';
import { ListingComponent } from './component/listing/listing.component';
import { DialogBox } from './dialogbox/dialogbox.component';
import { RemovewhitespacesPipe } from './custompipe/removewhitespaces.pipe';
import { DragDropDirective } from './directive/drag-drop.directive';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    EditpostComponent,
    HeaderComponent,
    RemovewhitespacesPipe,
    DragDropDirective,
    ListingComponent,
    DialogBox
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FilePickerModule,

    // Flex-layout
    FlexLayoutModule,

    ToastrModule.forRoot()

  ],
  entryComponents: [ListingComponent, DialogBox],
  providers: [PostService,ListingComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
