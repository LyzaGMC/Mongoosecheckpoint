// Importer les modules nécessaires
const mongoose = require('mongoose');
require('dotenv').config(); // Pour charger les variables d'environnement à partir du fichier .env

// Connexion à la base de données MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion réussie à MongoDB Atlas'))
  .catch(err => console.error('Erreur de connexion à MongoDB Atlas', err));

// Définir le schéma de la personne
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] } // Tableau de chaînes de caractères
});

// Créer le modèle Person à partir du schéma
const Person = mongoose.model('Person', personSchema);

// Fonction pour créer et sauvegarder une personne
const createPerson = (name, age, favoriteFoods) => {
  const person = new Person({ name, age, favoriteFoods });
  person.save((err, data) => {
    if (err) return console.error(err);
    console.log('Personne créée:', data);
  });
};

// Créer plusieurs personnes avec Model.create()
const arrayOfPeople = [
  { name: 'John', age: 25, favoriteFoods: ['pizza', 'pasta'] },
  { name: 'Mary', age: 30, favoriteFoods: ['burritos', 'salad'] },
  { name: 'Tom', age: 22, favoriteFoods: ['sushi', 'ramen'] },
];

Person.create(arrayOfPeople, (err, data) => {
  if (err) return console.error(err);
  console.log('Personnes créées:', data);
});

// Utiliser model.find() pour rechercher des personnes par nom
const findPeopleByName = (name) => {
  Person.find({ name: name }, (err, people) => {
    if (err) return console.error(err);
    console.log('Personnes trouvées:', people);
  });
};

// Utiliser model.findOne() pour rechercher une personne par aliment préféré
const findPersonByFood = (food) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return console.error(err);
    console.log('Personne trouvée par aliment préféré:', person);
  });
};

// Utiliser model.findById() pour rechercher par _id
const findPersonById = (personId) => {
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    console.log('Personne trouvée par ID:', person);
  });
};

// Exécuter des mises à jour classiques
const updateFavoriteFood = (personId) => {
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    person.favoriteFoods.push('hamburger'); // Ajouter 'hamburger' aux aliments préférés
    person.markModified('favoriteFoods'); // Marquer le champ comme modifié
    person.save((err, updatedPerson) => {
      if (err) return console.error(err);
      console.log('Personne mise à jour:', updatedPerson);
    });
  });
};

// Exécuter une mise à jour avec findOneAndUpdate()
const updateAgeByName = (personName) => {
  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true }, // Renvoyer le document mis à jour
    (err, updatedPerson) => {
      if (err) return console.error(err);
      console.log('Personne mise à jour par nom:', updatedPerson);
    }
  );
};

// Supprimer une personne par _id
const deletePersonById = (personId) => {
  Person.findByIdAndRemove(personId, (err, deletedPerson) => {
    if (err) return console.error(err);
    console.log('Personne supprimée:', deletedPerson);
  });
};

// Supprimer toutes les personnes nommées 'Mary'
const deleteManyByName = (name) => {
  Person.remove({ name: name }, (err, result) => {
    if (err) return console.error(err);
    console.log('Résultat de la suppression de personnes nommées Mary:', result);
  });
};

// Trouver des personnes qui aiment les burritos, trier par nom, limiter à 2 documents et masquer l'âge
const findAndSortFoodLovers = (food) => {
  Person.find({ favoriteFoods: food })
    .sort({ name: 1 }) // Trier par nom
    .limit(2) // Limiter à 2 documents
    .select('-age') // Masquer l'âge
    .exec((err, data) => {
      if (err) return console.error(err);
      console.log('Personnes qui aiment les burritos:', data);
    });
};

// Exécuter les fonctions de test (décommentez les lignes ci-dessous pour les exécuter)

// createPerson('Alice', 28, ['chocolate', 'cookies']); // Créer une personne
// findPeopleByName('John'); // Rechercher par nom
// findPersonByFood('burritos'); // Rechercher par aliment préféré
// findPersonById('ID_DE_VOTRE_PERSONNE'); // Remplacez par un ID valide
// updateFavoriteFood('ID_DE_VOTRE_PERSONNE'); // Remplacez par un ID valide
// updateAgeByName('John'); // Mettre à jour l'âge de John
// deletePersonById('ID_DE_VOTRE_PERSONNE'); // Supprimer par ID
// deleteManyByName('Mary'); // Supprimer toutes les personnes nommées Mary
// findAndSortFoodLovers('burritos'); // Trouver et trier

// Déconnecter la base de données lorsque toutes les opérations sont terminées
// mongoose.connection.close();
