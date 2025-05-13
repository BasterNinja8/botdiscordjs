require('dotenv').config(); // Charge les variables d'environnement
const keepAlive = require('./keep_alive'); // Importer le fichier
const { REST, Routes, Client, SlashCommandBuilder, EmbedBuilder, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN ;
const clientId = process.env.CLIENT_ID ;
const guildId = process.env.GUILD_ID ;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

let upBloque = false;
let userLastCommandDate = {};

let statsGlobaux = {
    "KIM": {"con": 88.0, "tra": 88.0, "men": 88.0, "réa": 88.0, "pré": 88.0, "nst": 88.0, "ene": 88.0},
    "KOV": {"con": 88.0, "tra": 88.0, "men": 88.0, "réa": 88.0, "pré": 88.0, "nst": 88.0, "ene": 88.0},
    "DIA": {"con": 87.0, "tra": 87.0, "men": 87.0, "réa": 87.0, "pré": 87.0, "nst": 87.0, "ene": 87.0},
    "MED": {"con": 87.0, "tra": 87.0, "men": 87.0, "réa": 87.0, "pré": 87.0, "nst": 87.0, "ene": 87.0},
    "THE": {"con": 87.0, "tra": 87.0, "men": 87.0, "réa": 87.0, "pré": 87.0, "nst": 87.0, "ene": 87.0},
    "ROS": {"con": 88.0, "tra": 88.0, "men": 88.0, "réa": 88.0, "pré": 88.0, "nst": 88.0, "ene": 88.0},
    "AIE": {"con": 88.0, "tra": 88.0, "men": 88.0, "réa": 88.0, "pré": 88.0, "nst": 88.0, "ene": 88.0},
    "FER": {"con": 87.5, "tra": 87.5, "men": 87.5, "réa": 87.5, "pré": 87.5, "nst": 87.5, "ene": 87.5},
    "NIA": {"con": 86.5, "tra": 86.5, "men": 86.5, "réa": 86.5, "pré": 86.5, "nst": 86.5, "ene": 86.5},
    "GAS": {"con": 85.0, "tra": 85.0, "men": 85.0, "réa": 85.0, "pré": 85.0, "nst": 85.0, "ene": 85.0},
    "GRO": {"con": 86.0, "tra": 86.0, "men": 86.0, "réa": 86.0, "pré": 86.0, "nst": 86.0, "ene": 86.0},
    "BIL": {"con": 85.5, "tra": 85.5, "men": 85.5, "réa": 85.5, "pré": 85.5, "nst": 85.5, "ene": 85.5},
    "BEL": {"con": 86.5, "tra": 86.5, "men": 86.5, "réa": 86.5, "pré": 86.5, "nst": 86.5, "ene": 86.5},
    "VER": {"con": 84.5, "tra": 84.5, "men": 84.5, "réa": 84.5, "pré": 84.5, "nst": 84.5, "ene": 84.5},
    "CON": {"con": 87.0, "tra": 87.0, "men": 87.0, "réa": 87.0, "pré": 87.0, "nst": 87.0, "ene": 87.0},
    "GAI": {"con": 86.0, "tra": 86.0, "men": 86.0, "réa": 86.0, "pré": 86.0, "nst": 86.0, "ene": 86.0},
    "NIT": {"con": 85.0, "tra": 85.0, "men": 85.0, "réa": 85.0, "pré": 85.0, "nst": 85.0, "ene": 85.0},
    "HUL": {"con": 86.5, "tra": 86.5, "men": 86.5, "réa": 86.5, "pré": 86.5, "nst": 86.5, "ene": 86.5},
    "END": {"con": 86.5, "tra": 86.5, "men": 86.5, "réa": 86.5, "pré": 86.5, "nst": 86.5, "ene": 86.5},
    "NUN": {"con": 85.5, "tra": 85.5, "men": 85.5, "réa": 85.5, "pré": 85.5, "nst": 85.5, "ene": 85.5},
    "LAU": {"con": 83.0, "tra": 83.0, "men": 83.0, "réa": 83.0, "pré": 83.0, "nst": 83.0, "ene": 83.0},
    "SAN": {"con": 84.0, "tra": 84.0, "men": 84.0, "réa": 84.0, "pré": 84.0, "nst": 84.0, "ene": 84.0},
    "CRI": {"con": 83.0, "tra": 83.0, "men": 83.0, "réa": 83.0, "pré": 83.0, "nst": 83.0, "ene": 83.0},
    "WIN": {"con": 83.0, "tra": 83.0, "men": 83.0, "réa": 83.0, "pré": 83.0, "nst": 83.0, "ene": 83.0},
    "AWK": {"con": 82.5, "tra": 82.5, "men": 82.5, "réa": 82.5, "pré": 82.5, "nst": 82.5, "ene": 82.5},
    "AYV": {"con": 83.0, "tra": 83.0, "men": 83.0, "réa": 83.0, "pré": 83.0, "nst": 83.0, "ene": 83.0},
    "BIA": {"con": 84.0, "tra": 84.0, "men": 84.0, "réa": 84.0, "pré": 84.0, "nst": 84.0, "ene": 84.0},
    "WIL": {"con": 83.5, "tra": 83.5, "men": 83.5, "réa": 83.5, "pré": 83.5, "nst": 83.5, "ene": 83.5},
    "GAE": {"con": 82.5, "tra": 82.5, "men": 82.5, "réa": 82.5, "pré": 82.5, "nst": 82.5, "ene": 82.5},
    "AME": {"con": 82.5, "tra": 82.5, "men": 82.5, "réa": 82.5, "pré": 82.5, "nst": 82.5, "ene": 82.5},
    "BRO": {"con": 82.0, "tra": 82.0, "men": 82.0, "réa": 82.0, "pré": 82.0, "nst": 82.0, "ene": 82.0}
};

let nomsPrenoms = {
    "KIM": ["Hae Won", "Kim", "Femme", "Formula One"],
    "BIA": ["Charles", "Bianchi", "Homme", "Formula Two"],
    "WIL": ["Leclerc", "Wilveur", "Homme", "Formula Two"],
    "NIA": ["Lewis", "Niamate", "Homme", "Formula One"],
    "KOV": ["Riin", "Kovac", "Homme", "Formula One"],
    "AIE": ["Allessandro", "Aiello", "Homme", "Formula One"],
    "VER": ["Loyd", "Verstappen", "Homme", "Formula One"],
    "ROS": ["Oscar", "Rosberg", "Homme", "Formula One"],
    "GAS": ["Léo", "Gasly", "Homme", "Formula One"],
    "FER": ["Tom", "Fernandez", "Homme", "Formula One"],
    "CON": ["Noah", "Connor", "Homme", "Formula One"],
    "GAI": ["Gabriele", "Aiello", "Homme", "Formula One"],
    "HUL": ["Justin", "Huler", "Homme", "Formula One"],
    "BEL": ["Marc-Antoine", "Belmondini", "Homme", "Formula One"],
    "CRI": ["Crio", "Crionidas", "Homme", "Formula Two"],
    "NUN": ["Rio", "Nuno", "Homme", "Formula One"],
    "BIL": ["Jakie", "Biloutte", "Homme", "Formula One"],
    "NIT": ["Trivality", "Nitrox", "Homme", "Formula One"],
    "DIA": ["Zach", "Diaz", "Homme", "Formula One"],
    "THE": ["Tome", "Théo", "Homme", "Formula One"],
    "GRO": ["Alex", "Groël", "Homme", "Formula One"],
    "MED": ["Léo", "Médo", "Homme", "Formula One"],
    "WIN": ["Kurt", "Winkler", "Homme", "Formula Two"],
    "END": ["Félix", "Ender", "Homme", "Formula One"],
    "AWK": ["Lewis", "Awkins", "Homme", "Formula Two"],
    "AYV": ["Soraya", "Ayvaz Mutut", "Homme", "Formula Two"],
    "GAE": ["Hadjar", "Gaetan", "Homme", "Formula Two"],
    "AME": ["Antoine", "Médo", "Homme", "Formula Two"],
    "BRO": ["Gabriel", "Broniszweski", "Homme", "Formula Two"],
};


// ✅ Confirmation de connexion
client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'up') {
        if (upBloque) {
            return interaction.reply({ content: '❌ La commande `/up` est désactivée.', ephemeral: true });
        }

        // Rôle autorisé à bypass la restriction
        const allowedRoles = ['Staff du serveur']; // 🔹 Mets ici le nom du rôle qui peut faire autant de /up qu'il veut
        const memberRoles = interaction.member.roles.cache.map(role => role.name);
        const hasPrivilege = memberRoles.some(role => allowedRoles.includes(role));

        // Vérification quotidienne sauf pour les rôles autorisés
        const userId = interaction.user.id;
        const currentDate = new Date().toDateString();
        if (!hasPrivilege && userLastCommandDate[userId] === currentDate) {
            return interaction.reply({ content: "❌ Vous avez déjà utilisé `/up` aujourd'hui.", ephemeral: true });
        }

        const option = interaction.options.getInteger('option');
        const pronom = interaction.options.getString('pronom').toUpperCase();
        const categoriesInput = interaction.options.getString('categories').split(',').map(cat => cat.trim().toLowerCase());

        if (!statsGlobaux[pronom]) {
            return interaction.reply({ content: `❌ Le pilote \`${pronom}\` n'existe pas. Options : ${Object.keys(statsGlobaux).join(', ')}`, ephemeral: true });
        }

        let stats = statsGlobaux[pronom];

        for (const category of categoriesInput) {
            if (!stats[category]) {
                return interaction.reply({ content: `❌ La catégorie \`${category}\` n'existe pas. Options : ${Object.keys(stats).join(', ')}`, ephemeral: true });
            }
        }

        const incrementMap = {
            1: { count: 4, values: [0.1, 0.1, 0.1, 0.1] },
            2: { count: 2, values: [0.2, 0.2] },
            3: { count: 3, values: [0.2, 0.1, 0.1] },
            4: { count: 2, values: [0.3, 0.1] },
            5: { count: 1, values: [0.4] }
        };

        const increment = incrementMap[option];
        if (!increment || categoriesInput.length < increment.count) {
            return interaction.reply({ content: "❌ Nombre de catégories incorrect.", ephemeral: true });
        }

        for (let i = 0; i < increment.count; i++) {
            const category = categoriesInput[i];
            const increase = increment.values[i];

            if (stats[category] + increase > 100) {
                return interaction.reply({ content: `❌ \`${category.toUpperCase()}\` ne peut pas dépasser 100.`, ephemeral: true });
            }
            stats[category] += increase;
        }

        // Enregistre l'utilisation de la commande uniquement si l'utilisateur n'a pas le rôle spécial
        if (!hasPrivilege) {
            userLastCommandDate[userId] = currentDate;
        }

        const pilote = nomsPrenoms[pronom] || ["Inconnu", "Inconnu", "Inconnu", "Inconnu"];
        const [prenom, nom, sexe, categorie] = pilote;

        const noteGenerale = Math.round(Object.values(stats).reduce((sum, val) => sum + val, 0) / Object.values(stats).length);

        let responseMessage = ` 
# **DRIVER FICHE**

**Nom pilote** : ${prenom} ${nom}
**Sexe** : ${sexe}
**Catégorie** : ${categorie}

--------------------------

┌
          ${noteGenerale.toFixed(1)}          NOTE
                     générale
└

╭→     CON                    ${stats['con'].toFixed(1)}    ┐
┊       concentration
┊
┊→     TRA                    ${stats['tra'].toFixed(1)}
┊       trajectoire                   ┘
╰

╭→     MEN                    ${stats['men'].toFixed(1)}       ┐
┊       mentalité
┊
┊→     RÉA                    ${stats['réa'].toFixed(1)} 
┊       réaction
┊
┊→     PRÉ                   ${stats['pré'].toFixed(1)}
┊       précision                         ┘
╰

╭
┊→       NST                    ${stats['nst'].toFixed(1)}
┊         no stress
┊
┊→       ENE                    ${stats['ene'].toFixed(1)}
┊         energie
╰

  ***OFFICIAL STATS***

------------------------------------------
Besoin d’aide ? Merci de faire la commande \`/aide\`
`;

        await interaction.reply({ content: responseMessage });
    }
});



client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'bloquerup') {
        const allowedRoles = ['Staff du serveur']; // 🔹 Ajoute ici les rôles autorisés

        // Vérifie si l'utilisateur possède un des rôles autorisés
        const memberRoles = interaction.member.roles.cache.map(role => role.name);
        if (!memberRoles.some(role => allowedRoles.includes(role))) {
            return interaction.reply({ content: "❌ Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        // Bascule l'état de blocage de la commande /up
        upBloque = !upBloque;
        const etat = upBloque ? "désactivée" : "activée";
        await interaction.reply({ content: `✅ La commande \`/up\` est maintenant **${etat}**.`, ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'fiche') {
        const allowedRoles = ['1138098099613602013']; // Remplace par l'ID du rôle autorisé
        const memberRoles = interaction.member.roles.cache.map(role => role.id);
        
        // Vérification des permissions
        if (!memberRoles.some(role => allowedRoles.includes(role))) {
            return interaction.reply({ content: "❌ Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const pronom = interaction.options.getString('pronom').toUpperCase();

        // Vérifie si le pilote existe
        if (!statsGlobaux[pronom]) {
            return interaction.reply({ content: `❌ Le pilote \`${pronom}\` n'existe pas. Options : ${Object.keys(statsGlobaux).join(', ')}`, ephemeral: true });
        }

        // Récupération des infos
        const stats = statsGlobaux[pronom];
        const [prenom, nom, sexe, categorie] = nomsPrenoms[pronom] || ["Inconnu", "Inconnu", "Inconnu", "Inconnu"];
        const noteGenerale = Math.round(Object.values(stats).reduce((sum, val) => sum + val, 0) / Object.values(stats).length);

        // Création de l'embed (même style que /up)
        let responseMessage = `
        # **DRIVER FICHE**
        
        **Nom pilote** : ${prenom} ${nom}
        **Sexe** : ${sexe}
        **Catégorie** : ${categorie}
        
        --------------------------
        
        
        ┌
                  ${noteGenerale}          NOTE
                             générale
        └
        
        ╭→     CON                    ${stats['con'].toFixed(1)}    ┐
        ┊       concentration
        ┊
        ┊→     TRA                    ${stats['tra'].toFixed(1)}
        ┊       trajectoire                   ┘
        ╰
        
        ╭→     MEN                    ${stats['men'].toFixed(1)}       ┐
        ┊       mentalité
        ┊
        ┊→     RÉA                    ${stats['réa'].toFixed(1)} 
        ┊       réaction
        ┊
        ┊→     PRÉ                   ${stats['pré'].toFixed(1)}
        ┊       précision                         ┘
        ╰
        
        ╭
        ┊→       NST                    ${stats['nst'].toFixed(1)}
        ┊         no stress
        ┊
        ┊→       ENE                    ${stats['ene'].toFixed(1)}
        ┊         energie
        ╰
       
          ***OFFICIAL STATS***
        
        ------------------------------------------
        Besoin d’aide ? Merci de faire la commande \`/aide\`
                `;

        // Envoi de la fiche
        await interaction.reply({ content: responseMessage });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'aide') {
        const message = `
**Comment fonctionnent les commandes /up ?**

📌 **Syntaxe** :
\`/up [option] [pronom pilote ex : Aiello -> AIE] [statistiques à améliorer en minuscules]\`

Cette commande permet d'améliorer les statistiques d'un pilote en fonction de l'option choisie.

✅ **Options disponibles** :
1️⃣ **+0.1** sur **4 stats**  
2️⃣ **+0.2** sur **2 stats**  
3️⃣ **+0.2** sur **1 stat** et **+0.1** sur **2 stats**  
4️⃣ **+0.3** sur **1 stat** et **+0.1** sur **1 stat**  
5️⃣ **+0.4** sur **1 stat**  

📌 **Exemple d'utilisation** :
\`/up 2 AIE men tra\`  
Ici, les stats **men** et **tra** seront améliorées de **+0.2** chacune.

⚠️ **Note** : Si des résultats affichent plusieurs chiffres après la virgule, ne prenez en compte que le **premier chiffre après la virgule.**
        `;

        await interaction.reply({ content: message }); // Message normal, visible par tout le monde
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'stats') {
        const allowedRoles = ['Staff du serveur'];

        const memberRoles = interaction.member.roles.cache.map(role => role.name);
        if (!memberRoles.some(role => allowedRoles.includes(role))) {
            return interaction.reply({ content: "❌ Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        // Récupère les options
        const pronom = interaction.options.getString('pronom'); // Assure-toi que 'pronom' est bien défini dans la commande
        const mode = interaction.options.getInteger('mode');    // Assure-toi que 'mode' est un nombre entre 1 et 7

        if (!statsGlobaux[pronom]) {
            return interaction.reply(`❌ Le pilote '${pronom}' n'existe pas.`);
        }

        const stats = statsGlobaux[pronom];
        // Vérifier si les données existent pour ce joueur
        if (!statsGlobaux[pronom]) {
            return interaction.reply({ content: `❌ Aucune donnée trouvée pour ${pronom}.`, ephemeral: true });
        }
        
        // Récupérer les 7 valeurs (con, tra, men, réa, pré, nst, ene)
        const statsArray = [
            stats.con, stats.tra, stats.men, stats.réa, stats.pré, stats.nst, stats.ene
        ];
        
        // Calcul des moyennes pour chaque mode
        let result = `📊 **Stats calculées de ${pronom} (Mode 1 à 7)**\n`;

        let force, agression;
        // Calcul en fonction du mode
        if (mode === 1) {
            // Mode 1: 4 premières pour force, 3 dernières pour agression
            force = (statsArray[0] + statsArray[1] + statsArray[2] + statsArray[3]) / 4;
            agression = (statsArray[4] + statsArray[5] + statsArray[6]) / 3;
        } 
        if (mode === 2) {
            // Mode 2: 1ère pour agression, 2 dernières pour force, 4 autres pour force
            force = (statsArray[1] + statsArray[2] + statsArray[3] + statsArray[4]) / 4;
            agression = (statsArray[0] + statsArray[5] + statsArray[6]) / 3;
        } 
        if (mode === 3) {
            // Mode 3: 2 premières pour agression, 1ère et 3 autres pour force
            force = (statsArray[2] + statsArray[3] + statsArray[4] + statsArray[5]) / 4;
            agression = (statsArray[0] + statsArray[1] + statsArray[6]) / 3;
        } 
        if (mode === 4) {
            // Mode 4: 3 premières pour agression, 4 autres pour force
            force = (statsArray[3] + statsArray[4] + statsArray[5] + statsArray[6]) / 4;
            agression = (statsArray[0] + statsArray[1] + statsArray[2]) / 3;
        }
        if (mode === 5) {
             // Mode 5: 4 premières pour force, 3 autres pour agression
            force = (statsArray[4] + statsArray[5] + statsArray[6] + statsArray[0]) / 4;
            agression = (statsArray[1] + statsArray[2] + statsArray[3]) / 3;
        }
        if (mode === 6) {
            // Mode 6: Décale encore et applique les moyennes
            force = (statsArray[5] + statsArray[6] + statsArray[0] + statsArray[1]) / 4;
            agression = (statsArray[2] + statsArray[3] + statsArray[4]) / 3;
        } 
        if (mode === 7) {
            // Mode 7: Dernière variation
            force = (statsArray[6] + statsArray[0] + statsArray[1] + statsArray[2]) / 4;
            agression = (statsArray[4] + statsArray[5] + statsArray[3]) / 3;
        }
    
      

        const message = `
📊 **Stats calculées de ${pronom} (Mode ${mode})**  
💪 **Force** : ${force}  
🔥 **Agression** : ${agression}
        `;

        await interaction.reply(message);
        }
    });

// 📌 Enregistrement des commandes SLASH
const commands = [
    {
        name: 'up',
        description: 'Améliore les statistiques des pilotes',
        options: [
            {
                name: 'option',
                type: 4, // INTEGER
                description: 'Type d’amélioration',
                required: true
            },
            {
                name: 'pronom',
                type: 3, // STRING
                description: 'Pronom du pilote',
                required: true
            },
            {
                name: 'categories',
                type: 3, // STRING
                description: 'Catégories à améliorer (séparées par une virgule)',
                required: true
            }
        ]
    },
    {
        name: 'bloquerup',
        description: 'Active ou désactive la commande /up'
    },
    {
        name: 'fiche',
        description: 'Affiche la fiche d’un pilote',
        options: [
            {
                name: 'pronom',
                type: 3, // STRING
                description: 'Pronom du pilote',
                required: true
            }
        ]
    },
    {
        name: 'aide',
        description: 'Une aide pour la commande /up'
    },
    {
        name: 'stats',
        description: 'Affiche les stats d\'un pilote',
        options: [
            {
                name: 'pronom',
                type: 3, // ✅ STRING
                description: 'Le nom du pilote',
                required: true
            },
            {
                name: 'mode',
                type: 4, // ✅ INTEGER
                description: 'Mode de calcul (1 à 7)',
                required: true,
            }
        ]
    }
];



const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Enregistrement des commandes...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('✅ Commandes enregistrées avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors de l’enregistrement des commandes :', error);
    }
})();

// Connexion du bot
client.login(token);

keepAlive(); // Lancer le serveur Express
