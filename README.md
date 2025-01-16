# Matkailukeskus | Full-Stack Verkkosivuprojekti

Projekti on vielä keskeneräinen!

Matkailukeskus on full-stack verkkosivuprojekti, mikä on osa Colt Steelen [Udemy-kurssia](https://www.udemy.com/course/the-web-developer-bootcamp/?couponCode=24T1MT11625BROW)
Projektissa on käytetty mm. Node.js:ää, Expressiä, MongoDB:tä ja Bootstrappia. Autentikoinnissa käytetään Passport.js-kirjastoa.

## Live-demo
Vieraile matkailukeskuksessa https://matkailukeskus.datahavu.fi/


## Ominaisuudet
- Käyttäjät voivat luoda, muokata ja poistaa leirintäalueita.
- Käyttäjät voivat arvostella leirintäalueita
- Leirintäalueiden lajittelu ja haku

## Ympäristömuuttujat

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_KEY=
    CLOUDINARY_SECRET=
    MAPTILER_API_KEY=
    DATABASE_URL=mongodb://127.0.0.1:27017/matkailukeskus
    ENCRYPTION_SECRET=

## Vaatimukset
1. [mongodb](https://www.mongodb.com/)
2. [Cloudinary](https://cloudinary.com/) (Kuvien tallennukseen)
3. [NodeJS](https://nodejs.org/)

## Asennus
1. Kloonaa tai lataa tämä projekti.
2. Mene projektin kansioon:
    ```
    cd matkailukeskus
    ```
3. Asenna projektin riippuvuudet:
    ```
    npm install
    ```
4. Luo `.env`-tiedosto ja lisää ympäristömuuttujat (katso "Ympäristömuuttujat" -osio).
5. Käynnistä projekti:
    ```
    node --require dotenv/config index.js
    ```
5. Mene selaimessasi osoitteeseen [localhost](http://localhost/)
