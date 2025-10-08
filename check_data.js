const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/agent_dashboard_db')
  .then(async () => {
    console.log('✓ Connexion reussie\n');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('Collections trouvees:', collections.length);
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
    console.log('\n✓ Verification terminee');
    process.exit(0);
  })
  .catch(err => {
    console.log('✗ Erreur:', err.message);
    process.exit(1);
  });
