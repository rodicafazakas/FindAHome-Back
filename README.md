# Endpoints

Users

- [POST] /users/register
- [POST] /users/login
    - body: {username: 'Sanda', password: 'sandamaria'}


Announcements

- [GET] /announcements
- [GET] /announcements/: idAnnouncement;
    - Params: idAnnouncement
- [POST] /announcements/new
- [PUT] /announcements/: idAnnouncement
- [DELETE] /announcements/: idAnnouncement
    - Params: idAnnouncement