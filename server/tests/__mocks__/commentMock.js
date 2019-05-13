const commentMock = {
  _id: { $oid: '0123456783533f995b1756876' },
  authorId: '5c9dc5a619ae7924074940f4',
  itemId: '5ccd61134663533f995b1756',
  listId: '5ccd610f4663533f995b1755',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  updatedAt: { $date: { $numberLong: '1556963603400' } },
  createdAt: { $date: { $numberLong: '1556963603400' } },
  __v: { $numberInt: '0' }
};

const commentsMock = [
  {
    _id: { $oid: '0123456783533f995b1756876' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'John Doe',
      avatarUrl: 'www.pictures.pl'
    },
    itemId: '5ccd61134663533f995b1756',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: { $date: { $numberLong: '1556963603400' } }
  },
  {
    _id: { $oid: '0123456783533f995b1756876' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'William Doe',
      avatarUrl: 'www.photo.com'
    },
    itemId: '5ccd61134663533f995b1756',
    text: 'Maecenas ultricies non nisl et tincidunt.',
    createdAt: { $date: { $numberLong: '1556963607250' } }
  },
  {
    _id: { $oid: '0123456783533f995b1756876' },
    authorId: {
      _id: '5c9dc5a619ae7924074940f4',
      displayName: 'Brad Doe',
      avatarUrl: 'www.pictures.pl'
    },
    itemId: '5ccd61134663533f995b1756',
    text: 'Phasellus vehicula eros non volutpat rhoncus.',
    createdAt: { $date: { $numberLong: '1556963605200' } }
  }
];

const expectedCommentProperties = [
  '_id',
  'authorAvatarUrl',
  'authorId',
  'authorName',
  'createdAt',
  'itemId',
  'text'
];

module.exports = { commentMock, commentsMock, expectedCommentProperties };
