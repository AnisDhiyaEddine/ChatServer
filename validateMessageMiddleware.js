const Joi = require('@hapi/joi');
const { fromJson, toJson } = require('json-joi-converter');
const jsonSchemasNoyau = require('./schemas_noyau.json');
const jsonSchemasSpec = require('./schemas_spec.json');

// Convertir le schéma de validation JSON en schéma de validation Joi
const joiSchemasNoyau = {};
for (const [typeName, schema] of Object.entries(jsonSchemasNoyau)) {
    joiSchemasNoyau[typeName] = fromJson(schema);
}
// console.log('Joi Schemas:', joiSchemas);
// console.log('Joi Schemas - JSON:', toJson(joiSchemas));

const joiSchemasSpec = {};
for (const [typeName, schema] of Object.entries(jsonSchemasSpec)) {
    joiSchemasSpec[typeName] = fromJson(schema);
}

// Fusionner les schémas de validation Noyau et Spécifique
const joiSchemas = { ...joiSchemasNoyau, ...joiSchemasSpec };

// Fonction de validation pour vérifier les messages en fonction de leur type
const validateMessage = (message, next) => {
    let { type, content } = JSON.parse(message);
    content = JSON.parse(content);
    console.log('Content:', content);

    
    // Récupérer le schéma de validation correspondant au type de message
    const schema = joiSchemas[type];
    console.log('Schema:', toJson(schema));
    if (!schema) {
        console.error('Schema not found for type:', type);
        return;
    }

    // Validation du message
    //passer content en objet pour la validation
    const { error } = schema.validate(content);
    if (error) {
        console.error('Validation error:', error.message);
        throw new Error(error.message);
        return;
    }

    // Appel de la fonction next sans erreur de validation
    next();
};

module.exports = validateMessage;
