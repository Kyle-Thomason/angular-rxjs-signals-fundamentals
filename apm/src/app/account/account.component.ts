import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'pm-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html'

})
export class AccountComponent {
  pageTitle = 'Account';

  onSubmit(): void {
    console.log('Submit');
  } 

}
