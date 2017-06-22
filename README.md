# LibreCandy

<img src="doc/frontend/logo.png" width="200">

Librecandy è una piattaforma pensata e sviluppata per permettere agli utenti di condividere dei contenuti estetici per Linux. Questo progetto va a favore dell'open-source e cerca di migliorare l'esperienza degli utenti Linux nell'ambito di personalizzazione grafica del proprio ambiente desktop. La piattaforma fornisce la possibilità di poter commentare e votare dei prodotti di altri utenti nell'intento di creare una community che incarni a pieno i principi e i vantaggi dello sviluppo open-source.

Le principali features della piattaforma sono:

-

## Architettura

Per la produzione della piattaforma sono stati utilizzati i servizi di Microsoft Azure.
Microsoft Azure è una raccolta di servizi cloud integrati in continua evoluzione usata da sviluppatori e i professionisti IT per creare, distribuire e gestire applicazioni tramite la nostra rete globale di data center. Con Azure, hai la libertà di creare e distribuire in qualsiasi ambiente, usando gli strumenti, le applicazioni e i framework che preferisci.<sup><a href="https://azure.microsoft.com/it-it/overview/what-is-azure/">Microsoft</a></sup>
La produzione è stata studiata e progettata per poter essere altamente scalabile e per poter fornire prestazioni di tutto rispetto sin dai primi periodi di lancio. Per ottenere ciò Azure fornisce molti servizi che permettono di risolvere i più comuni problemi di produzione in modo semplice e veloce.

Di seguito viene illustrato quali servizi sono stati utilizzati:



<img src="doc/Icons/vm.png" width="50"> Virtual Machine (Backend)



<img src="doc/Icons/vm.png" width="50"> Virtual Machine (Frontend)

<img src="doc/Icons/db.png" width="50"> MongoDB Service

<img src="doc/Icons/cdn.png" width="50"> Content Delivery Network (CDN)

<img src="doc/Icons/storage.png" width="50"> Storage service

<img src="doc/Icons/log.png" width="50"> Application Insights - Log Analytics

<img src="doc/Icons/backup.png" width="50"> Recovery service

## Documentazione API

### BASE URI : /api/v1/

### User

#### /authenticate

##### Post

Genera un token JWT che assegna all'user. Genera un output con il token ed un messaggio di successo. Bisogna passare in input i dati di un'autenticazione di tipo BASIC.

#### /superuser

##### Post

Crea un nuovo utente (SOLO PER SUPERUSER)

**Parameters(Body)**

username
email
password
realname
bio

#### /users

##### Post

Crea un nuovo utente

**Parameters(Body)**

username
email
password
realname
bio

##### Get

Restituisce una lista di utenti (SOLO PER SUPERUSER)

**Parameters(Params)**

offset
limit

#### /users/:username

##### Get

Restituisce i dettagli dell'utente dato in input

**Parameters(Params)**

offset
limit

##### Put

Modifica i dettagli dell'utente dato in input

**Parameters(Body)**

realname
bio
password

##### Delete

Rimuove l'utente dato in input dal sistema

#### /users/:username/avatar

##### Post

Effettua un upload dell'immagine del profilo all'utente dato in input

**Parameters(File)**

file

##### Delete

Elimina l'immagine del profilo all'utente dato in input

#### /users/:username/treats

##### Get

Restituisce una lista di treats dell'utente dato in input

**Parameters(Params)**

offset
limit

### Treat

#### /treats

##### Get

Restituisce una lista di treats

**Parameters(Params)**

offset
limit

##### Post

Crea un nuovo treat

**Parameters(Body)**

name
category
description

#### /search

##### Get

Effettua una ricerca del treat e ritorna i risultati

**Parameters(Params)**

title

#### /treats/categories

##### Get

Restituisce tutte le categorie di treat possibili

#### /treats/categories/:category

##### Get

Restituisce una lista di treat della categoria data in input

**Parameters(Params)**

offset
limit

#### /treats/categories/:category/orderby/rating

##### Get

Restituisce una lista di treat della categoria data in input ordinati per rating

**Parameters(Params)**

offset
limit

#### /treats/orderby/rating

##### Get

Restituisce una lista di treat ordinati per rating

**Parameters(Params)**

offset
limit

#### /treats/:pkgname

##### Get

Restituisce i dettagli del treat dato in input

##### Delete

Elimina il treat dato in input

##### Put

Modifica la descrizione del treat dato in input

**Parameters(Body)**

description

#### /treats/:pkgname/versions

##### Post

Crea una nuova versione nel treat dato in input

**Parameters(Body)**

version

#### /treats/:pkgname/versions/:version

##### Put

Modifica la condizione di mantenimento della versione data in input del treat dato in input

**Parameters(Body)**

is_deprecated

##### Delete

Elimina la versione data in input del treat dato in input

#### /treats/:pkgname/versions/:version/file

##### Post

Effettua un upload del file sulla versione data in input del treat dato in input

**Parameters(Body)**

versionfile

#### /treats/:pkgname/screenshots

##### Post

Effettua un upload dello screenshot sul treat dato in input

**Parameters(Body)**

screenshot

#### /treats/:pkgname/screenshots/:scrotfilename

##### Put

Rende principale lo screenshot dato in input del treat dato in input

##### Delete

Elimina lo screenshot dato in input del treat dato in input

#### /treats/:pkgname/comments

##### Post

Crea un commento sul treat dato in input

**Parameters(Body)**

content

#### /treats/:pkgname/comments/:commentid

##### Put

Modifica il contenuto del commento dato in input

**Parameters(Body)**

content

##### Delete

Elimina il commento dato in input

#### /treats/:pkgname/ratings/fromuser

##### Get

Restituisce il rating inserito dall'utente che fa la richiesta sul treat dato in input

#### /treats/:pkgname/ratings

##### Post

Aggiunge un rating al treat dato in input

**Parameters(Body)**

rating

#### /treats/:pkgname/ratings/:ratingid

##### Put

Modifica il valore del rating dato in input del treat dato in input

**Parameters(Body)**

rating

##### Delete

Elimina il rating dato in input del treat dato in input

### Documentazione Database



### Struttura GitHub

### Links
