const Joi = require('@hapi/joi');
const { fromJson, toJson } = require('json-joi-converter');
const jsonSchemas = require('./schemas_noyau.json');

// Convertir le schéma de validation JSON en schéma de validation Joi
const joiSchemas = {};
for (const [typeName, schema] of Object.entries(jsonSchemas)) {
    joiSchemas[typeName] = fromJson(schema);
}
console.log('Joi Schemas:', joiSchemas);
console.log('Joi Schemas - JSON:', toJson(joiSchemas));


// Fonction de validation pour vérifier les messages en fonction de leur type
const validateMessage = (message, next) => {
    const { type, content } = JSON.parse(message);
    
    // Récupérer le schéma de validation correspondant au type de message
    const schema = joiSchemas[type];
    console.log('Schema:', toJson(schema));
    if (!schema) {
        console.error('Schema not found for type:', type);
        return;
    }

    // Validation du message
    const { error } = schema.validate({ content });
    if (error) {
        console.error('Validation error:', error.message);
        return;
    }

    // Appel de la fonction next sans erreur de validation
    next();
};

module.exports = validateMessage;
