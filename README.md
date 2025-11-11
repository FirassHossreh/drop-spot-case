1.  proje baslama suresi : 08/11/2025
2.	Proje özeti ve mimari açıklama : aslinda ben bir waitlist projesi yapmamizi istendi bende teknoloji olarak Frontend de Reactjs , Typescript , ant design , ContextApi ve Tailwincss kullandim ve Backend de Nodejs , Nestjs , Typescript , Typeorm , postgresql kullandim
3.	Veri modeli ve endpoint listesi : /api/v1/auth/login - email - POST, password | /api/v1/auth/register - name ,surName , email , password , roles ,createdAt , Updatedat , signupLatencyMs , accountAgeDays , rapidActions POST | /api/v1/auth/logout POST | /api/v1/auth/me GET | api/v1/admin/drops - GET | /api/v1/admin/drops - title ,description , startAt ,endAt - POST | api/v1/admin/drops/:id - title ,description , startAt ,endAt - UPDATE | /api/v1/admin/drops/:id - DELETE | api/v1/drops - GET | /api/v1/drops/:id/join - POST | /api/v1/drops/:id/leave - POST | localhost:5000/api/v1/drops/:id/claim - POST
4.	CRUD modülü açıklaması : CRUD Moduleleri hepsi yapili ama Delete Yapiliydi ama sonradan ben waitlist entity ekledim ve foreign key ile bagladim o yuzden silinmiyor ve duzeltemedim proje teslimi icin zamanim kalmadi ama genelde tum crud islemleri calisiyor
5.	Idempotency yaklaşımı ve transaction yapısı : yapildi ayni service bir kac tane entity ayni anda islem yaptigimda transcation yapisi kullandim burada this.dataSource.transaction()
6.	Kurulum adımları (backend ve frontend) : Frontend : npm intall sonrada npm run dev , Backend : npm install sonrada npm run start:dev
normal user ekrani
7.![WhatsApp Image 2025-11-11 at 07 20 00_201cc76b](https://github.com/user-attachments/assets/9d023704-1498-4f65-8a8b-f8f7ce1d3b4d)
8. register
9. ![WhatsApp Image 2025-11-11 at 07 20 13_c13c997e](https://github.com/user-attachments/assets/fb9b3442-311a-4889-98d7-58f350695296)
10. login
11. ![WhatsApp Image 2025-11-11 at 07 20 24_44484046](https://github.com/user-attachments/assets/d9de1127-6b37-4036-8855-31c35c6e47e0)
12. admin icin crud dashboard
13. ![WhatsApp Image 2025-11-11 at 07 20 59_9c23df78](https://github.com/user-attachments/assets/cf9b1476-4596-41de-bf61-254b30c77f6d)
14. admin icin crud dashboard modallari
15. ![WhatsApp Image 2025-11-11 at 07 22 21_6f0a15b2](https://github.com/user-attachments/assets/72e29d52-0b0d-4774-a152-59b96a50ed5a)
16. ![WhatsApp Image 2025-11-11 at 07 22 32_4cb1259f](https://github.com/user-attachments/assets/d35256d7-b83e-466e-b6f7-508003144174)
17. ![WhatsApp Image 2025-11-11 at 07 23 02_87ebf3d0](https://github.com/user-attachments/assets/c04d87a6-addc-4cb4-b619-772e845e7e5d)
18. Teknik tercihler ve kişisel katkılar : aslinda bu uygulama yaparken transaction yapisi ve Idempotency yaklaşımı bilmiyordum ve bu proje sayisinde ogrenmis oldum ve kendim olarak biraz daha pratik yaptim
19. Seed üretim yöntemi ve proje içindeki kullanımı : aslinda pdfte soylendigi gibi yaptim anladigim kadariyla , proje baslama tarihi , git reposu urlisi ve ilk commit atma tarihi sonrada birlestirip hashliyoruz.
20. 9.	Bonus: AI entegrasyonu : yapilmadi maalesef , zamanim kalmadi proje teslim suresine

kisisel not : merhaba size son olarak bir mesaj yazmak istedim aslinda ben bu proje yaparken cok sey ogrendim . ve buyuk capli projeler gelistirmek için kendimi geliştirmek istiyorum ve kendimi daha da ogrenip daha iyi seyler yapmak istiyorum . biliyorum yine mezunuyum ama inaniyorumki cok buyuk calisma temposu olan bir yerde cok sey ogrenirim ve guzel seye yapabilirim .ben çok isterimki bir mülakat tecrübem olsun ve kendimi daha iyi bir şekilde anlatabileyim . okdunuz için teşekkür ederim
        

       




