/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return knex.schema.hasTable('users').then(function(exists){
        if(!exists){
            return knex.schema.createTable('users', table => {
                table.increments('id').primary()
                table.string('name').notNullable()
                table.string('email').notNullable().unique()
                table.string('password').notNullable()
                table.boolean('admin').notNullable().defaultTo(false)
                table.timestamp('deleted_at')
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
    return knex.schema.hasTable('users').then(function(exists){
        if(exists){
            return knex.schema.dropTable('users')
        }
        return
    })
};
