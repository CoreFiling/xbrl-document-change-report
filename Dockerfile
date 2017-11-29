FROM artifacts.int.corefiling.com:5000/labs/simple-platform-server:2.1.0
ENV APP_NAME xbrl-document-change-report
ENV STATIC_DIR /app/static
COPY www $STATIC_DIR
