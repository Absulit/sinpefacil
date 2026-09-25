# SINPE Fácil


## About

Application made to simplify the use of SINPE Móvil in Costa Rica.

Made with Framework7

## Install

SINPE Fácil is a PWA, so open the link and install.

https://app.sinpefacil.com/

## Use

The app allows two main things:

### Create custom QR codes

If you are a seller, create a QR code per product you sell, then show it to the client for them to pay.

### Read the QR codes and Pay

Reading the QR code creates a SMS to send to the client respective bank with your number and amount to pay.

You do not need this app to first read the QR codes, you can use your regular QR scanner, and then click the link read from the QR code that will redirect to the webapp or installed app to generate the SMS to pay.

It is recommended for users to install the app.

Users also need the PIN provided by the seller to verify the QR code.

### Available Banks that offer the SINPE Móvil SMS service *

| Bank                            | SMS phone |
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

[* ref: participating institutions and details](https://app.powerbi.com/view?r=eyJrIjoiZmVkOGM0M2MtODc1Mi00ZjZkLWE0MGYtYjZmMmJlMGY5NjA2IiwidCI6IjYxOGQwYTQ1LTI1YTYtNDYxOC05ZjgwLThmNzBhNDM1ZWU1MiJ9&pageName=0e70f300db35b554b200)


### App Security

#### Local data encryption

Data is stored in an IndexedDB local database. This data is encrypted with a different key per user that is created on the first run.

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