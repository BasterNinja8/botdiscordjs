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
    "KIM": {"con": 92.8, "tra": 91.8, "men": 91.2, "réa": 91.2, "pré": 91.2, "nst": 91.2, "ene": 91.1},
    "NUN": {"con": 87.8, "tra": 96.0, "men": 85.0, "réa": 86.4, "pré": 90.0, "nst": 85.2, "ene": 85.0},
    "NIA": {"con": 96.8, "tra": 93.0, "men": 89.0, "réa": 87.0, "pré": 86.2, "nst": 85.4, "ene": 85.4},
    "WIL": {"con": 86.4, "tra": 99.8, "men": 81.0, "réa": 82.0, "pré": 83.4, "nst": 81.0, "ene": 82.0},
    "KOV": {"con": 99.8, "tra": 96.8, "men": 91.2, "réa": 91.0, "pré": 91.0, "nst": 91.0, "ene": 91.0},
    "AIE": {"con": 90.0, "tra": 100.0, "men": 93.6, "réa": 99.2, "pré": 85.0, "nst": 86.0, "ene": 85.0},
    "ROS": {"con": 96.0, "tra": 95.4, "men": 92.0, "réa": 92.0, "pré": 90.0, "nst": 90.0, "ene": 90.0},
    "PAI": {"con": 86.4, "tra": 86.2, "men": 86.4, "réa": 86.3, "pré": 86.3, "nst": 86.3, "ene": 86.4},
    "LFE": {"con": 89.0, "tra": 91.0, "men": 89.0, "réa": 88.4, "pré": 88.2, "nst": 88.0, "ene": 88.2},
    "TFE": {"con": 90.4, "tra": 99.4, "men": 88.6, "réa": 88.4, "pré": 99.2, "nst": 90.0, "ene": 88.6},
    "CON": {"con": 91.0, "tra": 90.0, "men": 91.0, "réa": 90.0, "pré": 90.0, "nst": 90.8, "ene": 91.0},
    "GAI": {"con": 81.0, "tra": 100.0, "men": 81.5, "réa": 96.3, "pré": 83.0, "nst": 81.0, "ene": 82.0},
    "HUL": {"con": 89.1, "tra": 89.2, "men": 89.2, "réa": 89.3, "pré": 88.9, "nst": 89.1, "ene": 89.6},
    "BEL": {"con": 90.8, "tra": 91.0, "men": 90.6, "réa": 90.8, "pré": 90.6, "nst": 87.4, "ene": 88.0},
    "PRO": {"con": 85.0, "tra": 84.0, "men": 86.0, "réa": 85.0, "pré": 84.4, "nst": 84.0, "ene": 85.4},
    "BIA": {"con": 89.0, "tra": 89.0, "men": 83.8, "réa": 84.2, "pré": 84.4, "nst": 84.0, "ene": 84.0},
    "BIL": {"con": 88.6, "tra": 88.2, "men": 88.2, "réa": 88.2, "pré": 88.2, "nst": 88.2, "ene": 88.6},
    "NIT": {"con": 86.0, "tra": 90.0, "men": 84.8, "réa": 84.0, "pré": 84.8, "nst": 84.8, "ene": 84.4},
    "DIA": {"con": 88.0, "tra": 99.8, "men": 88.0, "réa": 91.0, "pré": 84.0, "nst": 84.0, "ene": 84.0},
    "THE": {"con": 92.0, "tra": 93.0, "men": 88.0, "réa": 90.8, "pré": 88.0, "nst": 89.0, "ene": 88.0},
    "GRO": {"con": 86.0, "tra": 87.4, "men": 85.4, "réa": 87.0, "pré": 84.0, "nst": 85.0, "ene": 84.0},
    "MED": {"con": 90.0, "tra": 90.0, "men": 91.0, "réa": 90.0, "pré": 90.2, "nst": 90.4, "ene": 91.2},
    "PRY": {"con": 87.9, "tra": 87.9, "men": 87.9, "réa": 87.9, "pré": 87.9, "nst": 87.5, "ene": 87.5},
    "END": {"con": 92.4, "tra": 90.0, "men": 90.0, "réa": 90.0, "pré": 88.0, "nst": 88.0, "ene": 88.0}
};

let nomsPrenoms = {
    "KIM": ["Hae Won", "Kim", "Femme", "Formula One"],
    "BIA": ["Charles", "Bianchi", "Homme", "Formula One"],
    "WIL": ["Leclerc", "Wilveur", "Homme", "Formula One"],
    "NIA": ["Lewis", "Niamate", "Homme", "Formula One"],
    "KOV": ["Riin", "Kovac", "Homme", "Formula One"],
    "AIE": ["Allessandro", "Aiello", "Homme", "Formula One"],
    "PAI": ["Oscar", "Paistra", "Homme", "Formula One"],
    "ROS": ["Oscar", "Rosberg", "Homme", "Formula One"],
    "LFE": ["Luis", "Fernand", "Homme", "Formula One"],
    "TFE": ["Tom", "Fernandez", "Homme", "Formula One"],
    "CON": ["Noah", "Connor", "Homme", "Formula One"],
    "GAI": ["Gabriele", "Aiello", "Homme", "Formula One"],
    "HUL": ["Justin", "Huler", "Homme", "Formula One"],
    "BEL": ["Marc-Antoine", "Belmondini", "Homme", "Formula One"],
    "PRO": ["Alain", "Proviste", "Homme", "Formula One"],
    "NUN": ["Rio", "Nuno", "Homme", "Formula One"],
    "BIL": ["Jakie", "Biloutte", "Homme", "Formula One"],
    "NIT": ["Trivality", "Nitrox", "Homme", "Formula One"],
    "DIA": ["Zach", "Diaz", "Homme", "Formula One"],
    "THE": ["Tome", "Théo", "Homme", "Formula One"],
    "GRO": ["Alex", "Groël", "Homme", "Formula One"],
    "MED": ["Léo", "Médo", "Homme", "Formula One"],
    "PRY": ["Andreas", "Pryviat", "Homme", "Formula One"],
    "END": ["Félix", "Ender", "Homme", "Formula One"]
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

        let force = 0;
        let agression = 0;

        switch (mode) {
            case 1:
                force = moyenne(stats, [0, 1, 2, 3]);
                agression = moyenne(stats, [4, 5, 6]);
            case 2:
                force = moyenne(stats, [1, 2, 3, 4]);
                agression = moyenne(stats, [0, 5, 6]);
                
            case 3:
                force = moyenne(stats, [2, 3, 4, 5]);
                agression = moyenne(stats, [0, 1, 6]);
                
            case 4:
                force = moyenne(stats, [0, 2, 4, 6]);
                agression = moyenne(stats, [1, 3, 5]);
                
            case 5:
                force = moyenne(stats, [0, 1, 5, 6]);
                agression = moyenne(stats, [2, 3, 4]);
                
            case 6:
                force = moyenne(stats, [0, 3, 4, 6]);
                agression = moyenne(stats, [1, 2, 5]);
                
            case 7:
                force = moyenne(stats, [1, 2, 4, 5]);
                agression = moyenne(stats, [0, 3, 6]);
                
            default:
                return interaction.reply({ content: "❌ Mode invalide. Choisissez un nombre entre 1 et 7.", ephemeral: true });
        }

        function moyenne(stats, indices) {
        const values = indices.map(i => stats[i]).filter(v => typeof v === 'number');
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return Math.round(sum / values.length);
        }
        

        const message = `
📊 **Stats calculées de ${pronom} (Mode ${mode})**  
💪 **Force** : ${force}  
🔥 **Agression** : ${agression}
        `;

        await interaction.reply(message);
    }
});

// Fonction utilitaire pour calculer une moyenne
function moyenne(stats, indices) {
    const values = indices.map(i => stats[i]);
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
}



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
                choices: [
                    { name: 'Mode 1', value: 1 },
                    { name: 'Mode 2', value: 2 },
                    { name: 'Mode 3', value: 3 },
                    { name: 'Mode 4', value: 4 },
                    { name: 'Mode 5', value: 5 },
                    { name: 'Mode 6', value: 6 },
                    { name: 'Mode 7', value: 7 },
                ]
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
