#!/bin/bash
cd /home/kavia/workspace/code-generation/memory-stubs-organizer-130404-130413/ticket_stub_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

