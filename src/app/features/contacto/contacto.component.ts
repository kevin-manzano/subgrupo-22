import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactoComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly mostrarModalExito = signal(false);
  readonly intentoEnvio = signal(false);
  readonly fallbackImage = '/images/ImagenNull.png';

  readonly formularioContacto = this.formBuilder.nonNullable.group({
    nombreCompleto: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
      ]
    ],
    correoElectronico: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
  });

  readonly mensajeCaracteres = computed(() => this.formularioContacto.controls.mensaje.value.length);

  enviarFormulario(): void {
    this.intentoEnvio.set(true);

    if (this.formularioContacto.invalid || this.isSubmitting()) {
      this.formularioContacto.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.mostrarModalExito.set(true);
      this.formularioContacto.reset();
      this.intentoEnvio.set(false);
    }, 900);
  }

  cerrarModalExito(): void {
    this.mostrarModalExito.set(false);
  }

  mostrarError(controlName: 'nombreCompleto' | 'correoElectronico' | 'mensaje'): boolean {
    const control = this.formularioContacto.controls[controlName];
    return control.invalid && (control.touched || this.intentoEnvio());
  }

  mensajeError(controlName: 'nombreCompleto' | 'correoElectronico' | 'mensaje'): string {
    const control = this.formularioContacto.controls[controlName];

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (controlName === 'nombreCompleto') {
      if (control.hasError('maxlength')) {
        return 'El nombre no puede superar 50 caracteres';
      }

      if (control.hasError('pattern')) {
        return 'Solo se permiten letras';
      }
    }

    if (controlName === 'correoElectronico' && control.hasError('email')) {
      return 'Formato de correo invalido';
    }

    if (controlName === 'mensaje') {
      if (control.hasError('minlength')) {
        return 'El mensaje debe tener minimo 20 caracteres';
      }

      if (control.hasError('maxlength')) {
        return 'El mensaje no puede superar 500 caracteres';
      }
    }

    return 'Valor invalido';
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;

    if (!image || image.src.includes(this.fallbackImage)) {
      return;
    }

    image.src = this.fallbackImage;
  }
}
