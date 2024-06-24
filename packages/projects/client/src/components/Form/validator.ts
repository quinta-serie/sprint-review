class Validator {
    private emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    private numberRegex = /^[0-9]+$/;
    private cepRegex = /^\d{5}\d{3}$/;
    private telRegex = /(^\d{10}$)|(^$)/;
    private celRegex = /(^\d{11}$)|(^$)/;
    private cpfRegex = /^\d{3}\d{3}\d{3}\d{2}$/;
    private cnpjRegex = /^\d{2}\d{3}\d{3}\d{4}\d{2}$/;

    /**
     * Verifica a validade do email segundo o regex emailRegex
     * @param {string} email Email
    */
    public isValidEmail(email: string): boolean {
        return this.emailRegex.test(email);
    }

    /**
     * Verifica a validade do número segundo o regex numberRegex
     * @param {string} value Número
    */
    public isValidNumber(value: string): boolean {
        return this.numberRegex.test(value);
    }

    /**
     * Verifica a validade do número de telefone segundo o regex telRegex
     * @param {string} value Número de telefone
    */
    public isValidTel(value: string): boolean {
        return this.telRegex.test(value);
    }

    /**
     * Verifica a validade do número de celular segundo o regex celRegex
     * @param {string} value Número de celular
    */
    public isValidCel(value: string): boolean {
        return this.celRegex.test(value);
    }

    /**
     * Verifica a validade do número de cpf segundo o regex cpfRegex
     * @param {string} value Número de cpf
    */
    public isValidCpf(value: string): boolean {
        return this.cpfRegex.test(value);
    }

    /**
     * Verifica a validade do número de cnpj segundo o regex cnpjRegex
     * @param {string} value Número de CNPJ
    */
    public isValidCnpj(value: string): boolean {
        return this.cnpjRegex.test(value);
    }

    /**
     * Verifica a validade da senha segundo as regras de tamanho (length > = 6)
     * @param {string} value Senha
    */
    public isValidPassword(value: string): boolean {
        return value.length >= 6;
    }

    /**
     * Verifica a validade do cep
     * @param {string} value CEP
    */
    public isValidCep(value: string): boolean {
        return this.cepRegex.test(value);
    }

    /**
     * Verifica a validade do cel ou tel
     * @param {string} value CEL ou TEL
    */
    public isValidTelCel(value: string): boolean {
        return value.length === 10 || value.length === 11;
    }

    /**
     * Verifica a validade do percentual
     * @param {string} value Percent
    */
    public isValidPercent(value: string): boolean {
        return Number(value) >= 0 && Number(value) <= 100;
    }

    /**
    * Verifica se o elemento é vazio
    * @param {string} value Percent
   */
    public isEmpty(value: any): boolean {
        const type = typeof value;
        let isEmpty = false;

        if (type === 'boolean') {
            isEmpty = !value;
        } else if (type !== 'object') {
            isEmpty = !value;
        }
        // else if (type === 'object') {
        //     const sanitized = removeEmptyProperties(value);
        //     isEmpty = isEmptyObject(sanitized);
        // }

        return isEmpty;
    }
}

export default new Validator();
