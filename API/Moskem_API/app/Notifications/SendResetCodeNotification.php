<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SendResetCodeNotification extends Notification
{
    protected $code;

    public function __construct($code)
    {
        $this->code = $code;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Código de recuperación de contraseña - Moskem')
            ->greeting('Hola,')
            ->line('Has solicitado restablecer tu contraseña.')
            ->line('Tu código de verificación de 6 dígitos es:')
            ->line('**' . $this->code . '**')
            ->line('Este código vencerá en 15 minutos.')
            ->line('Si no solicitaste este cambio, puedes ignorar este mensaje.');
    }
}