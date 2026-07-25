function welcome(name: string) {
  console.log('hello');

  const user = {
    name: 'Rakesh',
  };

  const first_name = user.name;

  return name + first_name;
}

welcome('Chaudhary');
