RUN:=yarn

NAME:=sprint-review

# STYLE #
ERROR=\x1b[41m
SUCCESS=\x1b[42m
RESET=\x1b[0m
WARN=\x1b[30;43m

# ------------------------------------------------------------------------------------ #

# Função para executar comandos dentro do workspace
define run_in_workspace
	@echo ------------------------------------------------------------------------------;
	@printf "${WARN} RUNNING ${RESET}: $(1) - $(2) $(3)\n";
	@echo ;
	@$(RUN) workspace @$(NAME)/$(1) $(2) $(3)

	@if [ $$? -eq 0 ]; then \
		printf "${SUCCESS} SUCCESS ${RESET}: $(1) - $(2) $(3)\n"; \
		echo ------------------------------------------------------------------------------; \
	fi
endef

# Função principal que aceita parâmetros
run:
	$(call run_in_workspace,$(PROJECT),$(CMD))

# Extrair parâmetros dos argumentos posicionais
.PHONY: run
run:
	$(eval PROJECT := $(word 2, $(MAKECMDGOALS)))
	$(eval CMD := $(wordlist 3, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS)))
	$(call run_in_workspace,$(PROJECT),$(CMD))

# ----------------------------------------------- #