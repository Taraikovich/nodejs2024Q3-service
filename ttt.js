const arr = [
  {
    id: '9a4f2c37-2d68-4570-9ca8-26580ed1504c',
    name: 'TEST_TRACK',
    artistId: null,
    albumId: '296c5228-d281-4060-9c07-4dd5c47fa054',
    duration: 199,
  },
];

arr.forEach((i) => {
  if (i.albumId === '296c5228-d281-4060-9c07-4dd5c47fa054') {
    i.albumId = null;
  }
});

console.log(arr);
