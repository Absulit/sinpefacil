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

#### Códigos QR / Links

Los datos en los códigos QR están encriptados, esta encriptación es diferente a la data almacenada localmente. En este caso un PIN es creado cada 60 segundos, y usado para encriptar la data dentro del código QR junto con la hora actual (minuto) en que fue creado. Una vez leído el código QR o Link por la persona que quiera pagar, tienen 60 segundos para entrar el PIN para desencriptar los datos, si fallan tendrán que leer un nuevo código QR. Esto es llamado [TOPT](https://es.wikipedia.org/wiki/Algoritmo_de_contrase%C3%B1a_de_un_solo_uso_basada_en_el_tiempo).

This way we restrict the QR codes to a very short time frame, and the possibility to read a QR code on the street for a scam worthless.

De esta forma restringimos los códigos QR a un corto período de tiempo, e imposibilida leer un código QR en la calle que sea fraudulento.

La encriptación, el PIN y la encriptación basada en el tiempo también restringen la posibilidad de manipulación de los datos.

Al final del día, es del usuario la responsabilidad de verificar los datos que lea del código QR en la aplicación (SINPE Fácil) y justo antes de presionar el botón de enviar en la aplicación de SMS.

Los códigos QR y links se verifican que pertenezcan al dominio de la aplicacion (sinpefacil.com), esto significa que si lee un código QR no creado a través de la aplicación, le mostrará un mensaje que dice que el código QR tiene datos inválidos.

Además, hay otras validaciones que aseguran que la data es la que se se supone debe ser, incluso antes de hacer la llamada para crear el SMS.


#### TSL, HSTS y Cloudflare

El sitio web tiene un certificado TSL. También usa el encabezado [HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security#Solutions_with_preload_list) por medio de Cloudflare para restringir el acceso a la página con el protocolo HTTPS. Esto significa que si un usuario intenta entrar al sitio web por medio de de HTTP, será redireccionado a HTTPS y otras protecciones que bloquearían el sitio si alguien lo ha manipulado.

#### Tests o Pruebas

El projecto usa Playwright para probar la aplicación en general y para cosas como XSS (cross site scripting).

### Privacy Notice

#### Cumplimiento con la Ley N.° 8968.

Esta aplicación sigue la Ley de Protección de la Persona frente al tratamiento de sus datos personales. Ley N.° 8968.

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