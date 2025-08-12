# Setup vault configuration with springboot application

## Create policy to access secrets

telconnect-policy.hcl

path "secret/telconnect/data*" {
 capabilities = ["read"]
}

path "secret/telconnect/metadata/*" {
 capabilities = ["read"]
}

## Store this hcl file and create policy

vault policy write telconnect-policy telconnect-policy.hcl

## Create a role for telconnect and assume this policy (authentication using approle)

vault write auth/approle/role/telconnect-role token_policies="telconnect-policy" secret_id_ttl=60m token_ttl=60m token_max_ttl=4h

## Retrieve the role_id and secret_id

vault read auth/approle/role/telconnect-role/role-id
vault write -f auth/approle/role/telconnect-role/secret-id

--------------------------------------------------------------------

## Check the role created

vault read auth/approle/role/telconnect-role/