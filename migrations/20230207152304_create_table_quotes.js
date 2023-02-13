/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('quotes').then(function(exists){
        if(!exists){
            return knex.schema.createTable('quotes', table =>{
                table.increments('id').primary()
                table.text('quote').notNullable()
                  table.timestamps();
                table.integer('user_id').references('id').inTable('users')
            })
        }
        return
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.hasTable('quotes').then(function(exists){
        if(exists){
            return knex.schema.dropTable('quotes')
        }
        return
    })
};
