import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {
    @Input() OnlyNumber: boolean;
    @Input('DefaultValue') DefaultValue:string;
    private input: HTMLInputElement;
    constructor(private el: ElementRef) { 
    this.input = this.el.nativeElement;
  }

  

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    console.log(this.OnlyNumber)
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      
  }

  @HostListener('blur',['$event.target.value']) onBlur(value){
      if(this.input.value==='' || this.input.value === null)
      {
          this.input.value=this.DefaultValue;
      } 
  }

  @HostListener('change',['$event.target.value']) onChange(value){
    if(this.input.value==='' || this.input.value === null)
    {
        this.input.value=this.DefaultValue;
    } 
}
}