import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPessoaModalComponent } from './add-pessoa-modal.component';

describe('AddPessoaModalComponent', () => {
  let component: AddPessoaModalComponent;
  let fixture: ComponentFixture<AddPessoaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPessoaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPessoaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
