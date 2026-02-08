import React, { useState } from 'react';

interface JobOfferFormData {
    title: string;
    description: string;
    requirements: string; // Textarea input, will be split
    location: string;
    salaryMin: string;
    salaryMax: string;
    status: 'draft' | 'active' | 'closed';
    vacancies: string;
}

export const CreateJobOfferForm: React.FC = () => {
    const [formData, setFormData] = useState<JobOfferFormData>({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        status: 'draft',
        vacancies: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const requirementsArray = formData.requirements
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');

        const payload = {
            ...formData,
            requirements: requirementsArray,
            vacancies: formData.vacancies ? parseInt(formData.vacancies) : undefined,
            salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
            salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
        };

        try {
            const res = await fetch('/api/admin/job-offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                window.location.href = '/admin';
            } else {
                const data = await res.json();
                setError(data.error || 'Error al guardar la oferta');
            }
        } catch (err) {
            console.error(err);
            setError('Error de conexión al guardar la oferta');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 shadow-xl rounded-3xl px-8 pt-8 pb-8 mb-4 border border-neutral-800"
        >
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label
                    className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                    htmlFor="title"
                >
                    Título
                </label>
                <input
                    className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Ej: Electricista Industrial"
                    required
                    minLength={3}
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-6">
                <label
                    className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                    htmlFor="description"
                >
                    Descripción
                </label>
                <textarea
                    className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                    id="description"
                    name="description"
                    rows={5}
                    required
                    minLength={10}
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="mb-6">
                <label
                    className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                    htmlFor="requirements"
                >
                    Requisitos (uno por línea)
                </label>
                <textarea
                    className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                    id="requirements"
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                        className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                        htmlFor="location"
                    >
                        Ubicación
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                        id="location"
                        name="location"
                        type="text"
                        placeholder="Ej: Frankfurt, Alemania"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                        className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                        htmlFor="salaryMin"
                    >
                        Salario Mínimo (€)
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        placeholder="Ej: 2500"
                        value={formData.salaryMin}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full md:w-1/3 px-3">
                    <label
                        className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                        htmlFor="salaryMax"
                    >
                        Salario Máximo (€)
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        placeholder="Ej: 3000"
                        value={formData.salaryMax}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                        className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                        htmlFor="status"
                    >
                        Estado
                    </label>
                    <div className="relative">
                        <select
                            className="block appearance-none w-full bg-neutral-800 border border-neutral-700 text-white py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="draft">Borrador</option>
                            <option value="active">Activa</option>
                            <option value="closed">Cerrada</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label
                        className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider"
                        htmlFor="vacancies"
                    >
                        Vacantes
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-neutral-700 rounded-xl w-full py-3 px-4 text-white bg-neutral-800 leading-tight focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent transition-all placeholder-gray-500"
                        id="vacancies"
                        name="vacancies"
                        type="number"
                        min="1"
                        value={formData.vacancies}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-8">
                <button
                    className={`bg-action hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-action shadow-lg shadow-action/20 transition-all transform hover:scale-[1.02] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Oferta'}
                </button>
                <a
                    className="inline-block align-baseline font-bold text-sm text-gray-400 hover:text-white transition-colors"
                    href="/admin"
                >
                    Cancelar
                </a>
            </div>
        </form>
    );
};
