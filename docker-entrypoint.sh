# Source - https://stackoverflow.com/a/78112472
# Posted by Sebastian Liebscher, modified by community. See post 'Timeline' for change history
# Retrieved 2026-04-10, License - CC BY-SA 4.0

#!/bin/bash

# Apply migrations
npx prisma migrate deploy

exec "$@"
