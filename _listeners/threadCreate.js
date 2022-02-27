/**
 * @params { threadCreate } thread
 */

module.exports = async function threadCreate(thread) {
  thread?.join().catch(() => false)
}