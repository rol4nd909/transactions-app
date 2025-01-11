import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet if necessary

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet], // Add AppComponent to imports
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent); // Create the component instance
    component = fixture.componentInstance; // Get the component instance
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy(); // Ensure the component is created successfully
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('transactions-app'); // Check the title property
  });
});
