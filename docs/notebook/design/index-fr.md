Bienvenue sur le cahier de conception de LocoKit.

Cette partie, en Français, vise à préciser
certains choix que l'équipe à effectuer,
en recensant sur le moment les discussions,
les arguments, pour, contre, les hésitations,
qui ont amené à faire ces choix.

Ce cahier concerne la version "next" de LocoKit,
qui se veut être un gros step en avant
en terme de cas d'usage,
mais aussi d'utilisabilité.

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
