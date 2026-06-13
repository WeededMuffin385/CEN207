FROM gcr.io/distroless/cc-debian13:nonroot

ARG TARGET
ARG PROFILE

ENV RUST_LOG=info

COPY target/$TARGET/$PROFILE/backend /backend

USER nonroot:nonroot
ENTRYPOINT ["/backend"]
