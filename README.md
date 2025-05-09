# Matkailukeskus | Full-Stack Verkkosivuprojekti

Projekti on vielä keskeneräinen!

Matkailukeskus on full-stack verkkosivuprojekti, mikä on osa Colt Steelen [Udemy-kurssia](https://www.udemy.com/course/the-web-developer-bootcamp/?couponCode=24T1MT11625BROW)
Projektissa on käytetty mm. Node.js:ää, Expressiä, MongoDB:tä ja Bootstrappia. Autentikoinnissa käytetään Passport.js-kirjastoa. Leirintäalueet ja arvostelut ovat generoituja.

## Live-demo
Vieraile matkailukeskuksessa https://matkailukeskus.datahavu.fi/


## Ominaisuudet
- Käyttäjät voivat luoda, muokata ja poistaa leirintäalueita.
- Käyttäjät voivat arvostella leirintäalueita
- Leirintäalueiden lajittelu ja haku
- Käyttäjien muokkaus ja poisto
- Ja paljon muuta

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

## Kuvia
![image](https://github.com/user-attachments/assets/71c918b3-0e6e-4665-b4d5-d6f0af1751d0)

![image](https://github.com/user-attachments/assets/1394f2c3-98ac-46d6-81b7-16576946acdf)

![image](https://github.com/user-attachments/assets/c89bead7-e42d-4059-9373-78c25467fda2)


