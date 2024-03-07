export default defineEventHandler(async event => {
  return deleteCookie(event, 'session');
});
