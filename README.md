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

You do not need this app to first read the QR codes, you can use your regular QR scanner, and then click the link read from the QR code that will redirect to the webapp to generate the SMS to pay.

### Available Banks that offer the SINPE Móvil SMS service *

| Bank                            | SMS phone | 
|---------------------------------|----------:|
| Grupo Mutual Alajuela           | 6057-5079 |
| Banco Nacional de Costa Rica    | 2627      |
| Coopecaja                       | 6222-9526 |
| Banco Lafise                    | 9091      |
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


### Perform migrations

db.js has a `tests only` section at the top and at the bottom.
- Top to import.
- Bottom to export.

Export data from branch master to have a way to test future migrations.
Import the data and run the new migrations.
If required perform a `indexedDB.deleteDatabase('sf');` in the JS console to start with an empty DB.
