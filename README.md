# SINPE Fácil

[README ENGLISH](README.en.md)

Esta documentación está hecha principalmente para desarrolladores, para una explicación no técnica puede revisar la Política de Privacidad y los Términos del Servicio.

## Acerca de

Aplicación hecha para simplificar el uso del SINPE Móvil en Costa Rica.

Hecha con Framework7

## Instalación

SINPE Fácil es Aplicación Web Progresiva a (Progressive Web App - PWA), así que abra el link e instale.

https://app.sinpefacil.com/

## Uso

La aplicación permite principalmente dos cosas:

### Crear códigos QR

Si es un vendedor, puede crear un código QR por producto a vender, y luego mostrarlo a un cliente para que puedan pagarle.

### Leer los códigos QR y Pagar

Leer un código QR, luego de que el usuario lo confirme, redirecciona a la aplicación nativa de SMS del usuario que le permitirá enviar un mensaje al respectivo banco del cliente con el número de teléfono leído en el QR y un monto a pagar, con una descripción.

No necesita esta aplicación para leer los códigos QR, puede usar su aplicación lectora de QR, y luego hacer click en el link leído de este código QR, que lo redireccionará a la aplicación web o la aplicacion ya instalada en su teléfono para generar el SMS para pagar.

Es recomendado a los usuarios instalar la aplicación.

Los usuarios también necesitan el PIN provisto por el vendedor para verificar el código QR.

### Available Banks that offer the SINPE Móvil SMS service *

| Banco                           | Teléfono para enviar SMS |
|---------------------------------|----------:|
| Grupo Mutual Alajuela           | 6057-5079 |
| Banco Nacional de Costa Rica    | 2627      |
| Coopecaja                       | 6222-9526 |
| Caja de Ande                    | 6222-9532 |
| Coopealianza                    | 6222-9523 |
| Coocique                        | 4600-2905 |
| Banco BCT                       | 6040-0300 |
| Banco de Costa Rica             | 4066      |
| Banco Promérica                 | 6223-2450 |
| Credecoop                       | 7198-4256 |
| BAC Credomatic                  | 7070-1222 |
| Banco Davivienda                | 7070-7474 |

[* ref: instituciones participantes y detalles](https://app.powerbi.com/view?r=eyJrIjoiZmVkOGM0M2MtODc1Mi00ZjZkLWE0MGYtYjZmMmJlMGY5NjA2IiwidCI6IjYxOGQwYTQ1LTI1YTYtNDYxOC05ZjgwLThmNzBhNDM1ZWU1MiJ9&pageName=0e70f300db35b554b200)


### Segurida de la Aplicación

#### Encriptación de Datos Locales

Los datos son almacenados en una base local con IndexedDB. Estos datos son encriptados con una llave diferente por usuario que es creada la primera vez que se ejecuta la aplicación.

#### QR Codes / Links

Data in QR Codes is encrypted, this encryption is different to the local data. In this case a PIN created every 60 seconds, and used to encrypt the QR code data along with the current time (minute) of its creation. Once read the QR code or Link by the person who wants to pay, they have 60 seconds to enter the PIN to retrieve the data, if they fail they need to scan a new QR code. This is called [TOPT](https://en.wikipedia.org/wiki/Time-based_one-time_password).

This way we restrict the QR codes to a very short time frame, and the possibility to read a QR code on the street for a scam worthless.

The encryption, the PIN and the time based encryption also restrict the possibility of tampering with the data.

In the end is the user absolute responsability to verify the data read by the QR code in the app (SINPE Fácil) and right before hitting send in the SMS app.

QR codes and links are verified to belong to the app domain (sinpefacil.com), this means that if you scan a QR code not created via the app it will show a message saying that the QR has invalid data.

After these, there are other validations that ensure the data is what is supposed to be, even before sending the call to create the SMS.


#### TSL, HSTS and Cloudflare

The website has a TSL certificate. It also uses the [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security#Solutions_with_preload_list) header via Cloudflare to restrict access to the page with the HTTPS protocol. This means that if a user tries to enter the site via HTTP, it will be redirected to the HTTPS and other protections that would block the site if someone has tampered with it.

#### Tests

The project uses Playwright to test the application in general and for things like XSS (cross site scripting)


### Privacy Notice

#### Compliance with Costa Rican Law N.° 8968

This app follows the 8968 Costa Rican Law (Ley de Protección de la Persona frente al tratamiento de sus datos personales). Ley N.° 8968.

#### Data Retention & Deletion

This application processes and stores all data locally on your device using web browser storage (IndexedDB / localStorage). We do not operate a remote database, and your personal information is never transmitted to, stored on, or processed by external servers. You can permanently delete all app data at any time by clearing your browser site data or uninstalling the application.

Note: After uninstalling this data is permanently lost and unrecoverable.

#### Local Encryption

All the data (phone numbers, selected bank and history) are encrypted and they remain strictly on your device.

The developer and application do not collect, transmit or store your data on remote servers.


#### Analytics

The app uses Cloudflare to secure traffic and at the same time offers analytics without cookies.


### License

SINPE Fácil is open-source software released under the [MIT License](LICENSE).
<br>Copyright (c) 2026 Sebastián Sanabria Díaz.
<br>The app name, logo, and brand assets are reserved and not covered by the MIT License.


## Development

### Perform migrations

db.js has a `tests only` section at the top and at the bottom.
- Top to import.
- Bottom to export.

Export data from branch master to have a way to test future migrations.
Import the data and run the new migrations.
If required perform a `indexedDB.deleteDatabase('sf');` in the JS console to start with an empty DB.