Welcome on the LocoKit's design notebook.

This section try to explain
some choices that the team has made,
by listing discussion moments, arguments,
pros and cons, hesitations
that drive us to make these choices.

This notebook is about the LocoKit's `next` version,
which is a big step foreward
in terms of use cases and usability.

# Constat

À ce jour, LocoKit est un outil fonctionnel, capable de :
* permettre la modélisation d'un ou plusieurs modèles de données à travers une UI nocode
* gérer la donnée à travers une UI "type" tableur
* créer des interfaces de visualisation / modification de la donnée
* gérer au niveau ligne les permissions
* déclencher des webhooks à partir de la modification/création de la donnée

## Des erreurs de conception

Dans ses travers, le stockage utilisé est un stockage interne,
basé sur du JSONB, difficilement exploitable
en se câblant à la bdd directement.

Il n'a pas à ce jour la compétence de se greffer à une base déjà existante.
Si un utilisateur souhaite utiliser de la donnée existante,
nous devons soit créer un modèle qui mime sa base existante et importer
la donnée, soit introduire des mécanismes de synchronisation
potentiellement lourd, dangereux et coûteux.